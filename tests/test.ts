import 'reflect-metadata';
import {Container} from '../src/Container';
import {A} from './A';

const container = new Container();

let a = container.get(A)

