import create from 'zustand';

const useStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set((state) => state.user = user),
  setIsAuthenticated: (isAuthenticated) => set((state) => state.isAuthenticated = isAuthenticated)
}))

export default useStore;