import {B} from './B';
import {Injectable} from '../src/Injectable';

@Injectable()
export class A {
	b: B;
	constructor(b: B) {
	}
}