import { create } from "zustand";
import { persist } from "zustand/middleware";

export default create(persist(
	(setState) => ({
		user: {},
		setUser: (user) => setState({ user }),
		defaultPageSize: 5,
		setDefaultPageSize: (defaultPageSize) => setState({ defaultPageSize }),
		mode: "light",
		setMode: (mode) => setState({ mode }),
		favorites: [],
		toggleFavorite: (dashboard) => setState((state) => {
			const currentFavorites = state.favorites || [];
			const nextFavorites = currentFavorites.includes(dashboard)
				? currentFavorites.filter((item) => item !== dashboard)
				: [...currentFavorites, dashboard];
			return { favorites: nextFavorites };
		}),
	}),
	{
		name: "sgarden",
	},
));
