import SwiftUI

extension View {
    /// Renders appropriate state view based on LoadingState.
    @ViewBuilder
    func loadingOverlay<T: Sendable>(
        _ state: LoadingState<T>,
        @ViewBuilder loaded: (T) -> some View,
        onRetry: (@Sendable () async -> Void)? = nil
    ) -> some View {
        switch state {
        case .idle:
            self
        case .loading:
            LorealLoadingView()
        case .loaded(let value):
            loaded(value)
        case .error(let error):
            LorealErrorView(
                message: error.localizedDescription,
                onRetry: onRetry
            )
        }
    }
}
