npx protoc ^
  -I ./contracts/grpc/proto/ ^
  ./contracts/grpc/proto/*.proto ^
  --ts_proto_out=./contracts/grpc/gen ^
  --ts_proto_opt=nestJs=true ^
  --ts_proto_opt=package=omit ^
  --ts_proto_opt=forceLong=bigint