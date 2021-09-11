echo "Downloading importmap.json from AWS S3 bucket"
aws s3 cp s3://mftv/@DavidSprla/importmap.json importmap.json
echo "Updating importmap..."
node update-importmap.mjs
echo "Uploading importmap.json to AWS S3 bucket"
aws s3 cp importmap.json s3://mftv/@DavidSprla/importmap.json --cache-control 'public, must-revalidate, max-age=0' --acl 'public-read'
echo "Updating importmap was successful"