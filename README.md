# Typescript dependency container

## Usage

```
import {Container} from 'typescript-di-container';

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

