export default function validateQuery(schema: any) {
  return async (req: any, rep: any) => {
    req.query = schema.parse(req.query);
  };
}
