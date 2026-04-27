import Foundation

/// ViewModel for the customer list with search and segment filtering.
@MainActor
@Observable
final class CustomerListViewModel {
    private let repository: CustomerRepository

    var state: LoadingState<[Customer]> = .idle
    var searchQuery = ""
    var selectedSegment: String?
    var isSearching = false

    init(token: String) {
        self.repository = CustomerRepository(token: token)
    }

    func loadCustomers() async {
        state = .loading
        do {
            let customers = try await repository.findAll(segment: selectedSegment)
            state = .loaded(customers)
        } catch let error as APIError {
            state = .error(error)
        } catch {
            state = .error(.unknown(error.localizedDescription))
        }
    }

    func search() async {
        guard !searchQuery.trimmingCharacters(in: .whitespaces).isEmpty else {
            await loadCustomers()
            return
        }
        isSearching = true
        do {
            let results = try await repository.search(query: searchQuery)
            state = .loaded(results)
        } catch let error as APIError {
            state = .error(error)
        } catch {
            state = .error(.unknown(error.localizedDescription))
        }
        isSearching = false
    }

    func filterBySegment(_ segment: String?) async {
        selectedSegment = segment
        await loadCustomers()
    }
}
