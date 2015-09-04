BIN   = ./node_modules/.bin
PATH := $(BIN):$(PATH)
SRC   = $(wildcard src/*.js)
LIB   = $(SRC:src/%.js=lib/%.js)

lib: $(LIB)
lib/%.js: src/%.js
	@mkdir -p $(@D)
	$(BIN)/babel $< -o $@

lint:
	@ $(BIN)/eslint .

test: lint
	@ NODE_PATH='./test' $(BIN)/mocha \
		--compilers js:babel/register   \
		./test/tests.js

clean:
	@rm -rf ./lib

build: test clean lib

dev:
	@ node ./example/index.js

.PHONY: install test dev