import { create } from "zustand";
import {
  signupAPI,
  verifyAPI,
  loginAPI,
  checkAuthAPI,
  logoutAPI,
  forgotPassAPI,
  resetPassAPI,
  getSessionAPI,
  deleteSessionAPI,
  uploadAvatarAPI
} from "../api/auth.api";

export const useAuthStore = create((set) => ({
  user: null,
  sessions: [],
  isSessionsLoading: false,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  signup: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await signupAPI(data);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },

  verifyEmail: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await verifyAPI(data);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response.data.message || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },

  login: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await loginAPI(data);
      set({
        isAuthenticated: true,
        user: response.data.user,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error logging in",
        isLoading: false,
      });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await checkAuthAPI();
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      set({ error: null, isCheckingAuth: false, isAuthenticated: false });
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await logoutAPI();
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await forgotPassAPI({ email });
      set({
        message: response.data.message,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Something went wrong",
        isLoading: false,
      });
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await resetPassAPI(token, password);
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || "Error resetting password",
      });
      throw error;
    }
  },

  getSessions: async () => {
    set({
      isSessionsLoading: true,
      error: null,
    });

    try {
      const response = await getSessionAPI();

      set({
        sessions: response.data.sessions,
        isSessionsLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch sessions",
        isSessionsLoading: false,
      });

      throw error;
    }
  },

  deleteSession: async (sessionId) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      await deleteSessionAPI(sessionId);

      set((state) => ({
        sessions: state.sessions.filter(
          (session) => session.sessionId !== sessionId,
        ),

        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to delete session",

        isLoading: false,
      });

      throw error;
    }
  },

  uploadAvatar: async (file) => {
    try {
      set({ loading: true, error: null });

      const formData = new FormData();
      formData.append("avatar", file);

      const { data } = await uploadAvatarAPI(formData);

      set((state) => ({
        user: {
          ...state.user,
          avatar: data.avatarUrl,
        },
        loading: false,
      }));

      return data;
    } catch (error) {
      set({
        loading: false,
        error:
          error.response?.data?.message ||
          "Failed to upload avatar",
      });

      throw error;
    }
  },
}));
