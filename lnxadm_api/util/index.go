package util

import (
	"errors"
	"log"
	"net/http"
	"runtime/debug"
	"strconv"
	"time"
)

func Throw(err error) {
	if err != nil {
		panic(err)
	}
}

func Skip(err error) {
	if err != nil {
		log.Println(err)
		log.Println("skip error")
	}
}

func Catch() {
	var err interface{}
	err = recover()
	if err != nil {
		log.Println(err)
		log.Println(string(debug.Stack()))
	}
}

func Catch500(response http.ResponseWriter) {
	var err interface{}
	err = recover()
	if err != nil {
		log.Println(err)
		log.Println(string(debug.Stack()))
		Api(response, 500)
	}
}

func Ensure(ok bool) {
	if !ok {
		panic(errors.New("type assertion not ok"))
	}
}

func IsSet(args ...string) bool {
	return !IsNotSet(args...)

}

/*
is_not_set = nil || null || None || undefined
is_empty = "" || [] || {}
is_blank = is_not_set + is_empty

is_not_set = is_not_filled
is_blank = is_not_present
*/
func IsNotSet(args ...string) bool {
	var result bool

	var value string
	for _, value = range args {
		if value == "<nil>" || value == "undefined" || value == "null" {
			result = true
			break
		}
	}

	return result
}

func IsInt(args ...string) bool {
	return !IsNotInt(args...)
}

/*
If value doesn't exist, then continue.
If value exists, then it must be an integer.
*/
func IsNotInt(args ...string) bool {
	var err error

	var result bool

	var value string
	for _, value = range args {
		if value == "<nil>" || value == "undefined" || value == "null" {
			continue
		}

		_, err = strconv.ParseInt(value, 10, 64)
		if err != nil {
			result = true
			break
		}
	}

	return result
}

func ParseNil(value string) interface{} {
	// if value == "<nil>" {
	if value == "<nil>" || value == "undefined" || value == "null" {
		return nil
	}
	return value
}

func TimeTaken(start time.Time, name string) {
	var elapsed time.Duration
	elapsed = time.Since(start)
	log.Printf("%s took %s\n", name, elapsed)
}

func TimeNow() string {
	return time.Now().Format("2006-01-02 15:04:05")
}

/*
"" -----> 0001-01-01 00:00:00
"NULL" -> 0001-01-01 00:00:00
*/
func TimeOf(str string) string {
	// RFC3339 = "2006-01-02T15:04:05Z07:00"

	var x time.Time
	x, _ = time.Parse(time.RFC3339, str)

	return x.Format("2006-01-02 15:04:05")
}

func Contains(vs []string, x string) bool {
	var v string
	for _, v = range vs {
		if v == x {
			return true
		}
	}
	return false
}

func GetPagination(page int64, size int64, total int64) map[string]interface{} {
	var first int64
	var prev int64
	var next int64
	var last int64

	first = 1
	prev = page - 1
	next = page + 1
	last = ((total - 1) / size) + 1

	var is_first bool
	var has_prev bool
	var has_next bool
	var is_last bool

	if page == first {
		is_first = true
	}
	if prev >= first && prev <= last {
		has_prev = true
	}
	if next >= first && next <= last {
		has_next = true
	}
	if page == last {
		is_last = true
	}

	var pages []int64
	pages = make([]int64, 0)

	var i int64
	for i = 1; i <= last; i++ {
		if i >= (page-10) && i <= (page+10) {
			pages = append(pages, i)
		}
	}

	var pagination map[string]interface{}
	pagination = map[string]interface{}{
		"page":  page,
		"size":  size,
		"total": total,

		"first": first,
		"prev":  prev,
		"next":  next,
		"last":  last,

		"is_first": is_first,
		"has_prev": has_prev,
		"has_next": has_next,
		"is_last":  is_last,

		"pages": pages,
	}

	return pagination
}
