export function NewRoutes(app) {
  app.get('/', (req, res) => {
    res.send('hello world')
  })
}