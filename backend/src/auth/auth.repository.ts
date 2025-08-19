import { Injectable } from '@nestjs/common';
import { AbstractAuthRepository } from './abstracts/AbstractAuthRepository';

@Injectable()
export class AuthRepository extends AbstractAuthRepository {}
