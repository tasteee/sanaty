export const list = <DataT>(target: DataT[]) => {
  return {
    getById: (id: string) => getById<DataT>(target, id),
    intersect: (values: any[]) => intersect<DataT>(target, values)
    // getById: (id: string) => getById<DataT>(target, id)
  }
}

// Remove all intersections values from target.
function intersect<DataT>(target: DataT[], intersections: DataT[]) {
  return target.filter((item) => {
    return !intersections.includes(item)
  })
}

// Get the item from target that has provded id.
const getById = <DataT>(target: DataT[], id: string) => {
  return target.find((item: any) => {
    return item._id === id
  }) as DataT
}
