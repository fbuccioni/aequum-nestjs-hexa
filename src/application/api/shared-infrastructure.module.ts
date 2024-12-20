import { Injectable, Module } from '@nestjs/common';


const sharedInfrastructureComponents = [
    // Shared infrastructure components, repositories, etc.
]


// Make classes injectables
for (let c in sharedInfrastructureComponents)
    Injectable()(sharedInfrastructureComponents[c]);

// Define the shared infrastructure module
@Module({
    providers: sharedInfrastructureComponents,
    exports: sharedInfrastructureComponents,
})
export class SharedInfrastructureModule { }
