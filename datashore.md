
```ts
import { datashore } from 'datashore'

type FolderT = {
  id: string
  name: string
  path: string
  isActive: boolean
  sampleCount: number
  createdDate: number
}

type StoreT = {
  folders: FolderT[],
}

// Creates the file (empty) if it doesnt exist.
const source = datashore.load('./data/store.json')

// Allows you to clear previously saved data.
source.clear()

// Allows you to add starter data.
source.inject(/* some data */)

// Begins handling provided default data
// or the data found in the file as a live
// database.
const $store = source.start<StoreT>({
  folders: [],
  samples: [],
  collections: [],
  likes: []
})

const createFolder = (data: Partial<FolderT>) => {
  const id = crypto.randomUUID()
  const createdDate = Date.now()
  const name = data.path?.split('/').pop()
  return { id, name, createdDate, isActive: false, ...data}
}

const folder0 = createFolder({ path: 'C://a/b/c', sampleCount: 12 })
const folder1 = createFolder({ path: 'C://x/y/z', sampleCount: 27 })
const folder2 = createFolder({ path: 'C://q/r/s', sampleCount: 49 })

// Add a single document to the store.
$store.folders.insert(folder0)

// Add multiple documents to the store.
$store.folders.insert(folder1, folder2)

// This will retrieve all of the folder documents.
$store.folders.find()

// This fill retrieve the latest added folder document.
$store.folders.findOne()

// Erases all folder docs.
$store.folders.delete()

// Deletes a folder document by id.
$store.folders.delete('123')

// Both of these will delete folder docs with ids 123 and 456.
$store.folders.delete('123', '456')
$store.folders.delete(['123', '456'])

const $query = $store.createQuery({
  sampleCount$: { $isLessThan: 1 }, 
})

// Delete documents based on a query.
$store.folders.delete($query)

// These are all the same thing because any time an id is provided,
// then the find operation is considered a findOne. Passing just a string
// will be assumed to be an id.
$store.folders.find('123')
$store.folders.findOne('123')
$store.folders.find({ id: '123' })
$store.folders.findOne({ id: '123' })

const q = {} as any

{ 
  // $store.createQuery(QueryConfigT)
  
  const query = $store.createQuery({
    // normal keys will have their associated values
    // treates as $equals.
    foo: 'bar',
    bar: true,

    // keys suffixed with $ indicate that the
    // associated object value is a query
    // object
    sampleCount$: {
      $between: [25, 100],
      $notBetween: [10, 20],
      $greaterThan: 40,
      $notGreaterThan: 80,
      $lessThan: 75,
      $notLessThan: 0,
      $isNot: 42,
    },
  
    path$: {
      $contains: '//',
      $startsWith: 'C:',
      $endsWith: 'z',
      $isNot: 'C://Windows',
      $doesNotContain: 'bah',
      $isShorterThan: 40,
      $isLongerThan: 20,
      $isNotShorterThan: 15,
      $isNotLongerThan: 50,
    },

    isActive$: {
      $is: true,
      $equals: true,
      $isNot: false,
      $exists: true,
      $doesNotExist: false,
      $isTruthy: true,
      $isFalsey: false,
      $isNotTruthy: false,
      $isNotFalsey: true,
    },

    // query objects can be nested. this would
    // query doc.setings.theme.darkMode to be true.
    settings$: {
      theme$: {
        darkMode$: {
          $is: true
        }
      }
    }
  })
}


{
  const targetIds = ['aaa', 'bbb', 'ccc']
  const $query = $store.createQuery({ id: { $in: targetIds } })
  const $sort = $store.createSort({ order: 'ascending', by: 'dateCreated' })

  const results = await $store.folders.find($query, $sort)
  // results is a normal array of objects that match
  // the queries and that are sorted accordingly.
}


{
  const targetIds = ['aaa', 'bbb', 'ccc']
  const $query = $store.createQuery()

  $query.apply('id').isIn(targetIds)
  $query.apply('id').isNot('321')
  $query.apply('id').isNotIn(['543', '654', '765'])

  $query.apply('sampleCount').isGreaterThan(20)
  $query.apply('path').contains('foo')

  const results = await $store.folders.find($query)
}



// const query0 = $store.folders.query('sampleCount').greaterThan(25)
// const query0 = $store.folders.query('sampleCount').kessThan(100)
// const query0 = $store.folders.query('sampleCount').between(25, 100)
// const query0 = $store.folders.query('id').in(['foo', 'bar', 'baz'])

{
  // $store.folders.query('sampleCount')
  //   .between(25, 100)
  //   .query('id')
  //   .in(['foo', 'bar', 'baz'])
  //   .not('bah')
  //   .query('path')
  //   .contains('foo/bar')
  //   .startsWith('C://')
  //   .endsWith('z')


    /*
    greaterThan(n)
    notGreaterThan(n)
    lessThan(n)
    notLessThan(n)
    between(n, n)
    notBetween(n, n)
    in(...a)
    notIn(...a)
    not(v)
    contains(v)
    doesNotContain(v)
    startsWith(v)
    doesNotStartWith(v)
    endsWith(v)
    doesNotEndWith(v)
    matches(/\w+/i)
    doesNotMatch(/\s\s/i)
    */
  // const query = $store.folders.query('id').notIn(['foo', 'bar', 'baz'])
}
  $store.folders.find()



```
  
## query options

$isBetween
$isNotBetween

$isGreaterThan
$isNotGreaterThan

$isLessThan
$isNotLessThan

$contains
$doesNotContain

$startsWith
$doesNotStartWith

$endsWith
$doesNotEndWith

$isShorterThan
$isNotShorterThan

$isLongerThan
$isNotLongerThan

$is
$isNot

$equals
$doesNotEqual

$exists
$doesNotExist

$isTruthy
$isNotTruthy

$isFalsey
$isNotFalsey

$isIn
$isNotIn
