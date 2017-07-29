declare var ENV: string;
declare var HMR: boolean;
declare var module: NodeModule;
declare var System: SystemJS;

interface NodeModule {
  id: string;
}

interface SystemJS {
  import: (path?: string) => Promise<any>;
}
