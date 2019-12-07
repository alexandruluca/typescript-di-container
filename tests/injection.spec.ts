import "reflect-metadata";
import {expect} from 'chai';
import 'mocha';
import {Container} from '../src/Container';
import {Injectable, Inject, ForwardRef} from '../src/Injectable';


@Injectable()
class A {

}

@Injectable()
class B {
	constructor(public a: A) {}
}

@Injectable()
class C {
	constructor(public b: B) {}
}


@Injectable()
class D {
    constructor(@Inject(new ForwardRef(() => E)) e: E) {}
}
@Injectable()
class E {
    constructor(d: D) {}
}

const container = new Container();

describe('Injection test', () => {
	it('expect class to be injected', () => {
		let c = container.get(C);
		expect(c instanceof C).to.be.equals(true);
		expect(c.b instanceof B).to.be.equals(true);
		expect(c.b.a instanceof A).to.be.equals(true);
	});

	it('expect circular dependency to throw error', () => {
		try {
			let d = container.get(D);
		} catch(err) {
			expect(err.message).to.be.equals('Circular dependency detected: D -> E -> D');
		}
	});
});