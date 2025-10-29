import type { ComponentData, ComponentGraph } from '../../src/components/types.js';

export const memoryStore = (dataset: ComponentGraph) => {

  const store: ComponentGraph = {
    ...dataset
  };

  const findComponent = async (componentId: string): Promise<ComponentData|undefined> => {
    return store.components.find(({ id }: ComponentData) => id === componentId);
  };

  const deleteComponent = async (componentId: string): Promise<void> => {

  };

  const clearStore = async (componentId: string): Promise<void> => {
    store.components = [];
    store.groups = [];
    store.edges = [];
  };

  const getAll = async (): Promise<ComponentGraph> => {
    return store;
  };

  return {
    findComponent,
    deleteComponent,
    clearStore,
    getAll
  };
};
