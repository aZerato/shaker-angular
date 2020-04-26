import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BaseResolverService } from 'src/app/shared/resolvers/base.resolver';

import { MovementService } from '../services/movement.service';
import { Movement } from '../models/movement.model';

@Injectable({
    providedIn: 'root'
})
export class MovementResolverService extends BaseResolverService<Movement> {

    constructor(
        router: Router,
        movementService: MovementService) { 
            super(router, movementService, '/movement');
        }
}