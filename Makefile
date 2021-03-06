SRC = $(shell find . -name '*.coffee' -type f)
LIB = $(SRC:%.coffee=%.js)

all: $(LIB)

watch:
	watch -n0.3 $(MAKE) all

clean:
	rm -f $(LIB)

publish:
	git push
	git push --tags
	npm publish

%.js: %.coffee
	coffee --map -bc $<
