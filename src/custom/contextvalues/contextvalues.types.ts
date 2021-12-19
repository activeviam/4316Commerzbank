

export interface ContextValueDescription {
  name: string,
  currentValue: string,
  description: string,
  type: string,
  category?: string
}

export interface CubeAndContextValues {
  cube: string,
  contextValues: Array<ContextValueDescription>
}

