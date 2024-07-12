declare module 'js-cookie' {
    interface CookiesStatic {
      get(name: string): string | undefined;
      set(name: string, value: string, options?: any): void;
      remove(name: string, options?: any): void;
    }
  
    const cookies: CookiesStatic;
    export default cookies;
  }
  