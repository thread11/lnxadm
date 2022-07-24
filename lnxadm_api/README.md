go build -ldflags="-linkmode=external -extldflags=-static" -o ./cms ./cms.go

go mod init lnxadm

go run main.go

go build
go test

go list
go list -m all

export GOPROXY=https://goproxy.cn
go get
go get -v
go get -u -v

go mod tidy
