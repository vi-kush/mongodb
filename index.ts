// Static by default (hoisted), async
import { MongoClient, Collection, Db , ObjectId, WithId, OptionalId, BulkWriteResult} from 'mongodb';
// or dynamic import
// async function load(){
// 	var imp = async () => {
// 		const { MongoClient, Collection, Db } = await import('mongodb');
// 		return { MongoClient, Collection, Db }
// 	}
// 	const { MongoClient, Collection, Db } = await imp();
// }


// require do not work as it does not expose proper TypeScript types 
// The corresponding .d.ts file (or types field in package.json {"types": "./types.d.ts"}) ia also checked by import
// Always dynamic (runs at runtime)
// var Db = require('mongodb').Db,
// 	Collection = require('mongodb').Collection,
// 	MongoClient = require('mongodb').MongoClient;

// npm i --save-dev ts-node
// npx ts-node index.js

let url = "mongodb+srv://user:pass@cluster0.host.mongodb.net/testdb";
/**
 * mongodb:// or mongodb+srv://         -> standard connection format
 * userneme:password@host[:port]/       -> creds
 * authDatabase1[,db2,db3...]/          -> authorized db name
 * ?<options>							-> eg ?retryWrites=true&w=majority
		maxPoolSize
		The maximum number of connections in the connection pool. The default value is 100.

		minPoolSize
		The minimum number of connections in the connection pool. The default value is 0.

		maxConnecting
		Maximum number of connections a pool may be establishing concurrently. The default value is 2.

		maxIdleTimeMS
		The maximum number of milliseconds that a connection can remain idle in the pool before being removed and closed.

		waitQueueMultiple
		A number that the driver multiplies the maxPoolSize value to, to provide the maximum number of threads allowed to wait for a connection to become available from the pool. For default values, see the driver documentation.

		waitQueueTimeoutMS
		The maximum time in milliseconds that a thread can wait for a connection to become available. For default values, see the driver documentation.
		
		replicaSet
		Specifies the name of the replica set, if the mongod is a member of a replica set. Set the replicaSet connection option to ensure consistent behavior across drivers.
		When connecting to a replica set, provide a seed list of the replica set member(s) to the host[:port] component of the uri. For specific details, refer to your driver documentation.

		directConnection
		Specifies whether the client connects directly to the host[:port] in the connection URI:
		true: The client sends operations to only the specified host. It doesn't attempt to discover any other members of the replica set.
		false: The client attempts to discover all servers in the replica set, and sends operations to the primary member. This is the default value.

		tls (ssl)
		Enables or disables TLS/SSL for the connection:
		true: Initiate the connection with TLS/SSL. Default for SRV Connection Format.
		false: Initiate the connection without TLS/SSL. Default for Standard Connection String Format.
		The ssl option is equivalent to the tls option.

		tlsInsecure
		true:Disables various certificate validations.

		connectTimeoutMS
		The time in milliseconds to attempt a connection before timing out. The default is 10,000 milliseconds, but specific drivers might have a different default. For details, see the driver documentation.

		socketTimeoutMS
		The time in milliseconds to attempt a send or receive on a socket before the attempt times out. The default is never to timeout, though different drivers might vary. See the driver documentation.

		compressors
		snappy, zlib, zstd

		zlibCompressionLevel
		-1		default (6)
		0		no
		1-9		level increases time

		wtimeoutMS
		Corresponds to the write concern wtimeout. wtimeoutMS specifies a time limit, in milliseconds, for the write concern.
		When wtimeoutMS is 0, write operations will never time out

		w
		{ w: "majority" } is the default write concern for most MongoDB deployments
		number
		eg: Scenario:
			You have a MongoDB replica set with 3 members:
			Primary node (Node 1)
			Secondary node (Node 2)
			Secondary node (Node 3)
			In a replica set, one node acts as the primary and the others are secondaries. The primary node accepts writes, and the secondary nodes replicate the changes from the primary.
			What does w: majority mean in this context?
			With a write concern of w: majority, MongoDB requires that more than half (a majority) of the nodes in the replica set must confirm that they have successfully written the data. In this case, since you have 3 nodes, the majority would be 2 nodes (including the primary).
			So when you specify w: majority in a write operation, it means the write operation will only be considered successful when at least 2 nodes (the primary and at least one secondary) confirm the write.

		readConcernLevel
		The level of isolation. Can accept one of the following values:
			local
			majority
			linearizable
			available

		serverSelectionTimeoutMS
		Specifies how long (in milliseconds) to block for server selection before throwing an exception. Default: 30,000 milliseconds.

		serverSelectionTryOnce
		Single-threaded drivers only. When true, instructs the driver to scan the MongoDB deployment exactly once after server selection fails and then either select a server or raise an error. When false, the driver blocks and searches for a server up to the serverSelectionTimeoutMS value. Default: true.

		retryReads
		Enables retryable reads.
		Possible values are:
		true. Enables retryable reads for the connection. (default)
		false. Disables retryable reads for the connection.

		retryWrites
		Enable retryable writes.
		Possible values are:
		true. Enables retryable writes for the connection. (default)
		false. Disables retryable writes for the connection.

		loadBalanced
		Specifies whether the client is connecting to a load balancer. This option is false by default.
		You can set this option to true only if you meet the following requirements:
		You specify only one host name.
		You aren't connecting to a replica set.
		The srvMaxHosts option is unset or has a value of 0.
		The directConnection option is unset or has a value of false.

		srvMaxHosts
		Specifies the number of mongos connections that can be created for sharded topologies. 

*/


// Open the connection to the server

// const client = new MongoClient(url, {
// 	ssl: true, // Required for Atlas
//   });

// async function run() {
//   	await client.connect()
	
// 	console.log("connected");
	
// 	const db = client.db("testdb");

// 	console.log('ok');
//     const result = await db.collection("testdb").findOne({});

// 	console.log(result);
// }

// run();

// MongoClient
// 	.connect(url, { ssl: true })
// 	.then(async (client: Client) => {
// 		// const db = client.db('testdb');
// 		// const result = await db.collection("testdb").findOne({});
// 		// console.log(result);

// 		// const db2 = client.db('newdb');

// 		// const col = await db2.collections();

// 		// // console.log(col);
// 		// if(col.length > 0){
// 		// 	console.log(col[0].collectionName);
// 		// 	console.log(col[0].dbName);
// 		// }


// 		// let col2 = db.collection('test')
// 		// // console.log(col2);

// 		// // will create new collection if not exists
// 		// await col2.insertMany([
// 		// 	{
// 		// 		test: '1',
// 		// 		ok: false
// 		// 	},{
// 		// 		test: '2',
// 		// 		ok: true	
// 		// 	}
// 		// ])

// 		// await db2.createCollection('new');

// 		// const newc = db2.collection('new');
// 		// await newc
// 		// 		.insertOne({test : 'value'})
// 		// 		.catch(console.log);
// 		// await newc.insertOne({test : 'value2'})
// 		// await newc.insertOne({test : 'value3'})

// 		// await db2.dropCollection('new')
// 		// 	.catch(console.log);

// 		// await db2.dropDatabase()
// 		// 	.catch(console.log);
	
// 	});


interface Person {
	name: String;
}

interface Center{
	name: string;
}

// [M:Person :: M:Center]
interface Paper{
	_id ?: ObjectId;
	name: String;
	date: Date;
	center: Center | null;
	person: ObjectId;
}

// one paper can be attempted multiple times
// [1:Paper :: M:Score]
interface Score{
	paper: ObjectId;
	date: Date;
	score: Number;
	grace: Number;
	passStatus?: Boolean;
}

interface ScorePaper extends Omit<Score, 'paper'>{
	paper: Paper
}

MongoClient
	.connect(url, { ssl: true })
	.then(async (client: MongoClient) => {
		
		const db: Db = new Db(client, 'testdb', {});

		const person: Collection<Person> = db.collection<Person>('person');

		await person.insertOne({name: 'Rahul'});

		const center: Collection<Center> = db.collection<Center>('center');
		
		await center.insertMany([
			{name: 'Center1'},
			{name: 'Center2'},
			{name: 'Center3'}
		]);

		const paper: Collection<Paper> = db.collection<Paper>('paper');

		let per = await person.findOne({name:'Rahul'});
		let cen = await center.findOne({name:'Center2'});

		console.log(per, cen);

		if(per){
			await paper.insertMany([
				{
					name: 'paper1',
					date: new Date(),
					center: cen,  		// will store complete object
					person: per._id		// will store only ObjectId
				},
				{
					name: 'paper2',
					date: new Date(),
					center: cen,
					person: per._id
				},
				{
					name: 'paper3',
					date: new Date(),
					center: cen,
					person: per._id
				}
			])
		}

		let ppr :WithId<Paper>[] = await paper.find({}).toArray();
		console.log(ppr);

		ppr = await paper.aggregate([
			{
				$lookup: {
					from: 'person',
					localField: 'person',
					foreignField: '_id',
					as: 'person'
				}
			},
			{ $unwind: '$person' }		//convert array to object
		]).toArray() as WithId<Paper>[];
		console.log('aggr',ppr);

		const score: Collection<Score> = db.collection<Score>('score');

		const scoreDoc: OptionalId<Score[]> = [];
		// or: const scoreDoc: Score[] = [];

		for(let p of ppr){
			scoreDoc.push({
				paper: p._id,
				date: new Date(),
				score: 0,
				grace: 0
			})
		}

		await score.insertMany(scoreDoc);

		let scr = await score.aggregate([
			{
				$lookup: {
					from: 'paper',
					localField: 'paper',
					foreignField: '_id',
					as: 'paper',
					// add person inside paper document
					pipeline:[
						{
							$lookup: {
								from: 'person',
								localField: 'person',
								foreignField: '_id',
								as: 'personData'
							}
						},
						{
							$unwind: {
								path: '$personData',
								preserveNullAndEmptyArrays: true
							}
						},
						{ $addFields: {'person_name':"$personData.name"}},
						// { $project: {'_id':0}}
					]
				}
			},
			{ $unwind: '$paper' },		// convert array to document
			// either way work -> using nested lookup in pipeline or below
			{							
				$lookup: {
					from: 'person',
					let: { perId: '$paper.person' },
					pipeline: [
						{ $match: { $expr: { $eq: ['$_id', '$$perId'] } } },
						{ $project: { _id: 0, person: 0 } }
					],
					as: 'person',
				}	
			},
			{ $unwind: '$person' },
			{ 
				$addFields: {
					'total_score': {
						$add:["$score", "$grace"]
					}
				}
			},
			{
				$match: {
					'total_score': {$eq : 0}
				}
			}
		]).toArray() as WithId<ScorePaper>[];
		
		console.log('aggr Scr',scr);
		/*{
			_id: new ObjectId('68205f266a9413a9095c3bb9'),
			paper: {
				name: 'paper3',
				date: 2025-05-11T08:26:14.719Z,
				center: [Object],
				person: new ObjectId('68205f266a9413a9095c3bb0'),     
				personData: { name: 'Rahul' },
				person_name: 'Rahul'
			},
			date: 2025-05-11T08:26:14.878Z,
			score: 0,
			grace: 0,
			person: { name: 'Rahul' },
			total_score: 0
		}*/

		await score.bulkWrite(
			// return array of updateOne Object.
			scr.map(doc => {
				
				let score = Math.floor(Math.random()*100);
				let grace = Math.floor(Math.random()*5);

				return {
					updateOne: {
						filter: { _id: new ObjectId(doc._id) },
						update: { 
							$set: { 
								score, 
								grace,
								passStatus: score + grace > 80
							} 
						},
						upsert: false		// optional
					}
				}
			})
		);

		let paperId: ObjectId = scr[0]?.paper?._id as ObjectId;

		scr = await score.aggregate([
			{
				$lookup: {
					from: 'paper',
					localField: 'paper',
					foreignField: '_id',
					as: 'paper',
				}
			},
			{ $unwind: '$paper' },		// convert array to document
			{							
				$lookup: {
					from: 'person',
					localField: 'paper.person',
					foreignField: '_id',
					as: 'person',
				}	
			},
			{ $unwind: '$person' },
			{ 
				$addFields: {
					'total_score': {
						$add:["$score", "$grace"]
					}
				}
			},
			{
				$match: {
					'total_score': {$eq : 0}
				}
			}
		]).toArray() as WithId<ScorePaper>[];

		console.log('aggr Scr2',scr);

		let stat = await score.deleteMany({
			_id: {
				$in: scr.map(doc => doc._id)
			}
		})

		console.log('delete Stat', stat);
		// {acknowledged: true, deletedCount: 18}

		let result: BulkWriteResult;

		result = await score.bulkWrite([
			{
				insertOne: {
					document: {
						paper: paperId,
						date: new Date(),
						score: 0,
						grace: 0
					}
				}
			},
			{
				replaceOne: {										// score.replaceOne
					filter:{										// 		({paper: paperId},
						paper: paperId								// 		{										
					},												// 			paper: paperId,						
					replacement:{									// 			score: Math.floor(Math.random()*100)
						paper: paperId,								// 			grace: Math.floor(Math.random()*5),	
						score: Math.floor(Math.random()*100),		// 			date: new Date()					
						grace: Math.floor(Math.random()*5),			// 		});							
						date: new Date()							// score.findOneAndReplace( ...above two params
					}												// 		{ returnDocument: 'after' })
				}													// 
			},
			{
				deleteOne:{												// score.deleteOne
					filter:{											//		({$and:[...same left side]})
						$and: [											//
						{ paper: paperId },								//
						{$expr: {										// score.findOneAndDelete( ...above one params
							$lte: [{ $add: ['$score', '$grace'] }, 0]	// 		{ returnDocument: 'after' })
						}}												//
						]												//
					}													//
				}														//
			}
		]);

		console.log(result);
		// BulkWriteResult {
		//   insertedCount: 1,
		//   matchedCount: 1,
		//   modifiedCount: 1,
		//   deletedCount: 0,
		//   upsertedCount: 0,
		//   upsertedIds: {},
		//   insertedIds: { '0': new ObjectId('68206cec65b2cb0abe920c6b') }        
		// }

		let scoreId = result.insertedIds[0];

		let updateResult: Promise<WithId<Score> | null>;

		updateResult = score.findOneAndUpdate(
			{_id: scoreId},
			{$set: {paper: paperId, score: 68}},
			{returnDocument: 'after', upsert: true }
		).then(doc => {
			return doc;
		})
		.catch(err => {
			return null
		});

		let data = await updateResult;

		console.log(data);

		//aggregate person wise score
		

		// // For monitoring, not document queries
		// result = await db.command({
        //     aggregate: 1,
        //     pipeline: [
        //         { $currentOp: { allUsers: true, idleConnections: true } }
        //     ],
        //     cursor: {}
        // });

		let sum = await score.aggregate([
			{
				$lookup: {
					from: 'paper',
					localField: 'paper',
					foreignField: '_id',
					as: 'paper',
				}
			},
			{ $unwind: '$paper' },
			{ 
				$group: {
					_id: {
						person: '$paper.person',
						paper: '$paper.name',
					},   
					total: { $sum: { $add: ["$score", "$grace"] } },   
					max: { $max: { $add: ["$score", "$grace"] } },   
					min: { $min: { $add: ["$score", "$grace"] } },  
					paperCount: { $sum: 1 }, 
					averageScore: { $avg: { $add: ["$score", "$grace"] } },
					names: { $push: "$paper.name" }
				} 
			},{
				$addFields:{
					size: {
						$size: '$names'
					}
				}
			}
		]).toArray();

		console.log('sum',sum);

		await db.dropDatabase();

		await client.close();

	})
	.catch( (err:Error) => {
		console.log(err);
	})

/*

🔄 Pipeline Stages
These are the top-level operators used to build an aggregation pipeline:

Operator	Description
$match	Filters documents (like a WHERE clause).
$project	Includes, excludes, or reshapes fields.
$group	Groups documents and performs aggregations (e.g., sum, avg).
$sort	Sorts the documents.
$limit	Limits the number of documents.
$skip	Skips a number of documents.
$unwind	Deconstructs arrays into separate documents.
$lookup	Joins with another collection.
$facet	Executes multiple pipelines on the same input.
$bucket	Categorizes documents into buckets.
$bucketAuto	Automatically determines bucket boundaries.
$count	Counts the number of documents.
$replaceRoot	Replaces the root document.
$replaceWith	Same as $replaceRoot, but more flexible.
$merge	Writes results to a collection.
$out	Outputs results to a collection (overwrites).
$addFields	Adds or modifies fields.
$set	Alias for $addFields.
$unset	Removes fields.
$sortByCount	Groups and sorts by count.
$unionWith	Merges pipelines from other collections.
$indexStats	Returns index usage statistics.
$planCacheStats	Returns plan cache statistics.
$currentOp	Returns current operations (used on admin DB).
$listSessions	Returns information about sessions.
$documents	Allows embedding raw documents directly into pipeline.

🧮 Accumulator Operators (used in $group, $setWindowFields, etc.)
Operator	Description
$sum	Sum of numeric values.
$avg	Average of numeric values.
$min	Minimum value.
$max	Maximum value.
$first	First value in group.
$last	Last value in group.
$push	Appends values to an array.
$addToSet	Appends unique values to an array.
$stdDevPop	Population standard deviation.
$stdDevSamp	Sample standard deviation.
$count	Number of documents.

🔢 Arithmetic Operators
Operator	Description
$add	Adds numbers.
$subtract	Subtracts numbers.
$multiply	Multiplies numbers.
$divide	Divides numbers.
$mod	Remainder (modulo).

📐 Array Operators
Operator	Description
$arrayElemAt	Access array element by index.
$concatArrays	Concatenates arrays.
$filter	Filters elements in an array.
$in	Checks if a value is in an array.
$indexOfArray	Returns index of a value.
$isArray	Checks if value is an array.
$map	Applies a function to each element.
$range	Creates an array from a range.
$reduce	Reduces an array to a single value.
$reverseArray	Reverses an array.
$size	Returns length of array.
$slice	Slices an array.
$zip	Merges arrays element-wise.

🔤 String Operators
Operator	Description
$concat	Concatenates strings.
$substr	Deprecated: Use $substrBytes or $substrCP.
$substrBytes	Extracts substring by bytes.
$substrCP	Extracts substring by code points.
$toLower	Converts to lowercase.
$toUpper	Converts to uppercase.
$trim, $ltrim, $rtrim	Trims whitespace or characters.
$split	Splits a string into an array.
$strLenBytes	Length in bytes.
$strLenCP	Length in code points.
$indexOfBytes, $indexOfCP	Finds index of substring.
$replaceOne, $replaceAll	Replaces substrings.

🧪 Comparison Operators
Operator	Description
$eq	Equals.
$ne	Not equals.
$gt	Greater than.
$gte	Greater than or equal.
$lt	Less than.
$lte	Less than or equal.
$cmp	Returns -1, 0, or 1 (comparison).

📆 Date Operators
Operator	Description
$dateFromParts	Creates date from parts.
$dateToParts	Extracts date parts.
$dateFromString	Converts string to date.
$dateToString	Formats date as string.
$dayOfWeek, $dayOfMonth, $dayOfYear	Day parts.
$year, $month, $week, $hour, $minute, $second	Other time parts.
$isoWeek, $isoDayOfWeek	ISO week values.
$dateDiff	Calculates time difference.
$dateAdd, $dateSubtract	Adds/subtracts time.

🧠 Conditional Operators
Operator	Description
$cond	If-else logic.
$ifNull	Returns alternate if value is null or missing.
$switch	Multiple conditional cases.
$case, $then, $default	Used inside $switch.

🔁 Type Conversion Operators
Operator	Description
$toString, $toInt, $toDouble, $toDecimal, $toLong	Convert to specified type.
$toDate, $toBool, $toObjectId	Convert to other types.
$convert	General-purpose conversion.
$type	Returns the BSON type of a field.

🔍 Set Operators
Operator	Description
$setEquals	Tests if two sets are equal.
$setIntersection	Returns common elements.
$setUnion	Combines sets.
$setDifference	Elements in one but not in the other.
$setIsSubset	Tests if one set is subset of another.
$anyElementTrue, $allElementsTrue	Logical operations on arrays.

🧬 Object Operators
Operator	Description
$mergeObjects	Merges multiple documents.
$objectToArray	Converts object to array of key-value pairs.
$arrayToObject	Converts array of key-value pairs to object.
$getField	Gets a dynamic field.
$setField	Sets a dynamic field.
$unsetField	Removes a dynamic field.

*/