#/bin/bash

mkdir api
touch api/index.ts
echo "import {app} from \"../src\";  export {app} " > api/index.ts
git add .
echo "enter the commit msg"
read commit_msg
git commit -m "$commit_msg"
git push mym
rm -r api
