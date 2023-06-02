const isUUID = (id: string) => {
  const uuidRegex = /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/i
  return uuidRegex.test(id)
}

export default isUUID
