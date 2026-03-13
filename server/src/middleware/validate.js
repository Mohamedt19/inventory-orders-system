export default function validate(schema, source = "body") {
    return (req, res, next) => {
      try {
        req[source] = schema.parse(req[source]);
        next();
      } catch (err) {
        return res.status(400).json({
          error: "Validation failed",
          details: err.issues ?? []
        });
      }
    };
  }