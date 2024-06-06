export function crud(table) {
  async function create(data) {
    console.log('data:', data)
    const ret = await $fetch(`/api/${table}`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
    console.log('ret update:', ret)
  }
  async function read(data) {
    if (data) {
      return await $fetch(`/api/${table}?${data}`)
    }
    else {
      return await $fetch(`/api/${table}`)
    }
  }
  async function update(data) {
    console.log('data:', data)
    const ret = await $fetch(`/api/${table}/${data.id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
    console.log('ret update:', ret)
  }
  async function del(data) {
    let obj
    console.log('data:', data)
    if (Array.isArray(data)) {
      obj = {
        id: {
          in: data.map(x => x.id)
        }
      }
    }
    else {
      obj = {
        id: data.id
      }
    }

    const ret = await $fetch(`/api/users`, {
      method: 'DELETE',
      body: obj
    })
    console.log('ret update:', ret)
  }
  async function updateorder(data) {
    const insertSQL = []
    console.log('data:', data)
    data.map((x, index) => {
      const columns_ = `(${Object.keys(x).join(',')})`
      const values_ = `(${Object.values(x).map((y) => {
        if (y == 'null') {
          return y
        }
else {
          return `'${y}'`
        }
      }).join(',')})`

      insertSQL[index] = `
            INSERT INTO ${table.value}
            ${columns_}
            VALUES
            ${values_};
        `
    })

    const sql = `
            BEGIN TRANSACTION;
            DELETE FROM ${table.value};
            ${insertSQL.join('')}
            COMMIT;
            `

    console.log('sql:', sql)
    const ret = await db.exec(sql)
  }
  return { create, read, update, del }
}
