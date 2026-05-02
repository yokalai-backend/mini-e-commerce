// I have some other modules that do the same just for validate other things, this is important since i use this for validating user inputs using zod.

export default function (schema: any) {
  return async (req: any, rep: any) => {
    console.log(req.body);
    req.body = schema.parse(req.body);
  };
}
