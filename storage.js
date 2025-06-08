export const gardenStorage = {
    save(gardenData) {
      const user = auth.getCurrentUser();
      if (!user) throw new Error("Not authenticated");
      
      const gardens = JSON.parse(localStorage.getItem('user_gardens') || {});
      gardens[user.id] = gardenData;
      localStorage.setItem('user_gardens', JSON.stringify(gardens));
    },
  
    load() {
      const user = auth.getCurrentUser();
      if (!user) return null;
      
      const gardens = JSON.parse(localStorage.getItem('user_gardens') || {});
      return gardens[user.id] || null;
    }
  };