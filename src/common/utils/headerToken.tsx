class HeaderToken {
    static getTokenConfig() {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      return config;
    }
  }
  
  export default HeaderToken;