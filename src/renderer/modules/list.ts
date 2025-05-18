export const list = <DataT>(target: DataT[]) => {
  return {
    getById: (id: string) => findById<DataT>(target, id),
    intersect: (values: any[]) => filterOut<DataT>(target, ...values)
    // getById: (id: string) => getById<DataT>(target, id)
  }
}

// Remove all intersections values from target.
export function filterOut<DataT>(target: DataT[], ...intersections: DataT[]) {
  return target.filter((item) => {
    return !intersections.includes(item)
  })
}

// Get items matching key/value from the target list.
export const findByKeyValue = <DataT>(target: DataT[], key: string, value: any) => {
  return target.find((item: any) => {
    return item[key] === value
  }) as DataT
}

// Get the item that has provded id from the target list.
export const findById = <DataT>(target: DataT[], id: string) => {
  return target.filter((item: any) => {
    return item.id === id
  }) as DataT[]
}

export const removeById = <DataT>(target: DataT[], id: string) => {
  return target.filter((item: any) => {
    return item.id !== id
  }) as DataT[]
}
