# MongoDB Operators

## Comparison Operators

- `$eq` - Matches values equal to a specified value.
- `$ne` - Matches all values not equal to a specified value.
- `$gt` - Matches values greater than a specified value.
- `$gte` - Matches values greater than or equal to a specified value.
- `$lt` - Matches values less than a specified value.
- `$lte` - Matches values less than or equal to a specified value.
- `$in` - Matches any of the values specified in an array.
- `$nin` - Matches none of the values specified in an array.

## Logical Operators

- `$and` - Joins query clauses with a logical AND.
- `$or` - Joins query clauses with a logical OR.
- `$not` - Inverts the effect of a query expression.
- `$nor` - Joins query clauses with a logical NOR.

## Element Operators

- `$exists` - Matches documents that have the specified field.
- `$type` - Matches documents with a specified field type.

## Evaluation Operators

- `$expr` - Allows the use of aggregation expressions within the query language.
- `$jsonSchema` - Validates documents against the given JSON Schema.
- `$mod` - Performs a modulo operation on the value of a field.
- `$regex` - Matches strings that match a specified regular expression.
- `$text` - Performs text search.
- `$where` - Matches documents that satisfy a JavaScript expression.

## Array Operators

- `$all` - Matches arrays that contain all elements specified.
- `$elemMatch` - Matches documents with at least one array element that matches all specified criteria.
- `$size` - Matches arrays with the specified number of elements.

## Bitwise Operators

- `$bitsAllClear` - Matches numeric or binary values with all set bits.
- `$bitsAllSet` - Matches numeric or binary values with all clear bits.
- `$bitsAnyClear` - Matches numeric or binary values with any set bits.
- `$bitsAnySet` - Matches numeric or binary values with any clear bits.

## Aggregation Pipeline Operators

- `$addFields` - Adds new fields to documents.
- `$bucket` - Categorizes incoming documents into groups.
- `$group` - Groups documents by specified keys.
- `$lookup` - Performs a join with another collection.
- `$match` - Filters documents to pass only those that match the condition(s).
- `$project` - Specifies fields to include or exclude in the output documents.
- `$sort` - Sorts documents.
- `$unwind` - Deconstructs an array field into separate documents.

## Update Operators

### Field Update Operators

- `$inc` - Increments the value of a field by a specified amount.
- `$mul` - Multiplies the value of a field by a number.
- `$rename` - Renames a field.
- `$set` - Sets the value of a field.
- `$unset` - Removes the specified field.
- `$min` - Updates the field to a specified value if the value is less.
- `$max` - Updates the field to a specified value if the value is greater.

### Array Update Operators

- `$addToSet` - Adds elements to an array if they don’t already exist.
- `$pop` - Removes the first or last element of an array.
- `$pull` - Removes elements from an array that match a condition.
- `$push` - Adds elements to an array.
- `$each` - Modifies `$push` to add multiple items.
- `$slice` - Modifies `$push` to limit the size of the array.
- `$sort` - Modifies `$push` to order array elements.

### Bitwise Update Operators

- `$bit` - Performs bitwise AND, OR, and XOR operations.

## Geospatial Operators

- `$geoIntersects` - Matches documents with geospatial data intersecting a specified geometry.
- `$geoWithin` - Matches documents within a specified geometry.
- `$near` - Finds documents near a point.
- `$nearSphere` - Finds documents near a point on a sphere.

## Miscellaneous Operators

- `$comment` - Adds comments to queries.
- `$meta` - Accesses metadata of documents.
- `$rand` - Generates random values.
