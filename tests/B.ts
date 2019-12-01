import {A} from './A';
import {Injectable, Inject, ForwardRef} from '../src/Injectable';

@Injectable()
export class B {
	private a: A;

	constructor(@Inject(new ForwardRef(() => A)) a: A) {
	}
}

