[![Build Status](https://travis-ci.com/alexandruluca/typescript-di-container.svg?branch=master)](https://travis-ci.com/alexandruluca/typescript-di-container)

# Typescript dependency container
This is a simple dependency constructor injection container for classes. Dependencies will be automatically mapped with help of reflect-metadata with the emitted
meta information. Each injectable class needs to be decorated with the "Injectable" decorator. This is because typescript only emits decorator metadata for decorated classes.

You will need to add followin lines to your tsconfig.json file

```
	"emitDecoratorMetadata": true,
	"experimentalDecorators": true,
```

## Usage

```
import {Container, Injectable} from 'typescript-di-container';

const container = new Container();

@Injectable()
class CacheService {
	constructor() {
	}
}

@Injectable()
class AuthRouter {
	cacheService: CacheService
	constructor(cacheService: CacheService) {
		this.cacheService = cacheService
	}
}

let authRouter = container.get(AuthRouter);

```

## Circular dependency checks
The container will automatically throw an error if a circular dependency is found

```
import {Injectable, Inject, ForwardRef, Container} from 'typescript-di-container';

@Injectable()
class D {
    constructor(@Inject(new ForwardRef(() => E)) e: E) {}
}
@Injectable()
class E {
    constructor(d: D) {}
}

const container = new Container();

const a = container.get(D);

// will throw error => Circular dependency detected: D -> E -> D
```

## Dealing with modules which have circular dependencies
If you have circular dependency between two modules, one module will be parsed before the other, meaning that when trying to inject the service, you will get an
undefined error.

In order to overcome this problem, one can use ForwardRef, like so

```
import {Injectable, Inject, ForwardRef, Container} from 'typescript-di-container';

@Injectable()
class D {
    constructor(@Inject(new ForwardRef(() => E)) e: E) {}
}
@Injectable()
class E {
    constructor(d: D) {}
}

const container = new Container();

const a = container.get(D);
```



