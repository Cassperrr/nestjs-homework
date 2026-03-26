npx protoc ^
  -I ./contracts/proto/ ^
  ./contracts/proto/*.proto ^
  --ts_proto_out=./contracts/gen ^
  --ts_proto_opt=nestJs=true ^
  --ts_proto_opt=package=omit ^
  --ts_proto_opt=forceLong=bigint