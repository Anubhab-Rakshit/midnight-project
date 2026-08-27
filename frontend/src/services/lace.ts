export interface WalletState {
  address: string | null;
  tNightBalance: number;
  dustBalance: number;
  isConnected: boolean;
}

export const connectLace = async (): Promise<WalletState> => {
  // In a real environment, we'd interact with window.midnight?.mnLace
  // For the frontend layout, we'll simulate a successful connection 
  // since the backend agent (Opencode) will provide the actual SDK bindings.
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        address: "mn_addr_preprod13zlyk4cr9qqygx3h5swk6xl2lk80vv0ut874ze66fhx3xda0umtqdt24za",
        tNightBalance: 1000,
        dustBalance: 50,
        isConnected: true
      });
    }, 1500);
  });
};

export const disconnectLace = async (): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, 500));
};
