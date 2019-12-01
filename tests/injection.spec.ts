import "reflect-metadata";
import {expect} from 'chai';
import 'mocha';
import {Container} from '../src/Container';
import {Injectable} from '../src/Injectable';


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

const container = new Container();

describe('Injection test', () => {
	it('expect class to be injected', () => {
		let c = container.get(C);
		expect(c instanceof C).to.be.equals(true);
		expect(c.b instanceof B).to.be.equals(true);
		expect(c.b.a instanceof A).to.be.equals(true);
	});
});