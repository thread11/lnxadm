package util

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"
)

func NotFound(response http.ResponseWriter, request *http.Request) {
}

func WrapHandler(h http.Handler) http.Handler {
	return http.HandlerFunc(
		func(response http.ResponseWriter, request *http.Request) {
			/*
				var err error

				var path string
				path = request.URL.Path
				log.Println(path)

				var file string
				// file = fmt.Sprintf("build%s", path)
				file = fmt.Sprintf("../frontend/build%s", path)
				log.Println(file)

				if !strings.HasPrefix(path, "/static/") {
					_, err = os.Stat(file)
					if err != nil {
						log.Println("Page Not Found")
						// http.Redirect(response, request, "/", 302)
						http.NotFound(response, request)
						return
					}
				}
			*/
			log.Println(request.URL.Path)
			h.ServeHTTP(response, request)
		},
	)
}

/*
https://golang.org/src/net/http/request.go?s=42331:42377#L1312
*/
func FormValueOf(request *http.Request, key string) string {
	var value string = "<nil>"

	if request.Form == nil {
		const defaultMaxMemory = 32 << 20
		request.ParseMultipartForm(defaultMaxMemory)
	}

	var vs []string
	vs = request.Form[key]

	if len(vs) > 0 {
		value = strings.TrimSpace(vs[0])
	}

	return value
}

func API_(response http.ResponseWriter, data interface{}) {
	var err error

	var result []byte

	var code int64
	code = 200

	var msg string
	msg = "OK"

	if data != nil {
		result, err = json.Marshal(
			struct {
				Code int64       `json:"code"`
				Msg  string      `json:"msg"`
				Data interface{} `json:"data"`
			}{
				Code: code,
				Msg:  msg,
				Data: data,
			},
		)
	} else {
		result, err = json.Marshal(
			struct {
				Code int64  `json:"code"`
				Msg  string `json:"msg"`
			}{
				Code: code,
				Msg:  msg,
			},
		)
	}

	Throw(err)

	log.Println(string(result))

	response.Header().Set("Content-Type", "application/json")
	response.Write(result)
}

func Api(response http.ResponseWriter, code int, args ...interface{}) {
	var err error

	var body []byte

	var payload map[string]interface{}
	payload = make(map[string]interface{})

	payload["code"] = code
	payload["msg"] = http.StatusText(code)

	if len(args) == 0 {
	} else if len(args) == 1 {
		payload["data"] = args[0]
	} else if len(args) == 2 {
		payload["data"] = args[0]

		var k string
		var v interface{}

		for k, v = range args[1].(map[string]interface{}) {
			payload[k] = v
		}
	} else {
	}

	body, err = json.Marshal(payload)
	Throw(err)

	// log.Println(string(body))

	response.Header().Set("Content-Type", "application/json; charset=utf-8")
	response.WriteHeader(code)
	response.Write(body)
}

func GetIP(request *http.Request) string {
	var ip string
	ip = request.Header.Get("X-Real-Ip")

	if ip == "" {
		ip = request.Header.Get("X-Forwarded-For")
	}
	if ip == "" {
		ip = request.RemoteAddr
	}

	return ip
}
