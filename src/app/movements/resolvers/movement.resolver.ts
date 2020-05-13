import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { MovementService } from '../services/movement.service';
import { MovementModel } from '../models/movement.model';
import { BaseServerResolverService } from 'src/app/shared/resolvers/base-server.resolver';

@Injectable({
    providedIn: 'root'
})
export class MovementResolverService extends BaseServerResolverService<MovementModel> {

    constructor(
        router: Router,
        movementService: MovementService) { 
            super(router, movementService, '/movement');
        }
}