import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BaseResolverService } from 'src/app/shared/resolvers/base.resolver';

import { TrainingService } from '../services/trainings.service';
import { Training } from '../models/training.model';

@Injectable({
    providedIn: 'root'
})
export class TrainingResolverService extends BaseResolverService<Training> {

    constructor(
        router: Router,
        trainingService: TrainingService) 
        { 
            super(router, trainingService, '/training');
        }
}