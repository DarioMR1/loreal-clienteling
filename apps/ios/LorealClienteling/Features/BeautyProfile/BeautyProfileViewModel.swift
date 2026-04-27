import Foundation

/// ViewModel for loading and managing a customer's beauty profile.
@MainActor
@Observable
final class BeautyProfileViewModel {
    private let repository: BeautyProfileRepository

    var state: LoadingState<BeautyProfile?> = .idle

    init(token: String) {
        self.repository = BeautyProfileRepository(token: token)
    }

    func loadProfile(customerId: String) async {
        state = .loading
        do {
            let profile = try await repository.findProfile(customerId: customerId)
            state = .loaded(profile)
        } catch let error as APIError {
            state = .error(error)
        } catch {
            state = .error(.unknown(error.localizedDescription))
        }
    }

    func saveProfile(_ body: UpsertBeautyProfileBody) async -> Bool {
        do {
            let updated = try await repository.upsert(body)
            state = .loaded(updated)
            return true
        } catch {
            return false
        }
    }
}
