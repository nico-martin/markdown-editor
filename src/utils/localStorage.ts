const MODELS_CACHED_KEY = 'modelsCached';

const getAllModelsCached = (): Array<string> =>
  JSON.parse(localStorage.getItem(MODELS_CACHED_KEY) || '[]').filter(Boolean);

export const setModelsCached = (models: Array<string>) =>
  localStorage.setItem(MODELS_CACHED_KEY, JSON.stringify(models));

export const isModelCached = (model: string): boolean =>
  getAllModelsCached().includes(model);

export const setModelCached = (model: string) => {
  const models = getAllModelsCached();
  models.push(model);
  setModelsCached(models);
};
