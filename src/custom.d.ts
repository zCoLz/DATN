declare module "*.svg" {
    import React from 'react';
    const content: string;
    export default content;
  }
  
  declare module '*.png' {
    const value: string;
    export default value;
  }