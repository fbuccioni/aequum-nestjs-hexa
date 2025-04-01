import { Injectable, Module } from '@nestjs/common';


const sharedInfrastructureComponents = [
    // Shared infrastructure components, repositories, etc.
]


// Make classes injectables
for (const c of sharedInfrastructureComponents)
    Injectable()(c);

// Define the shared infrastructure module
@Module({
    providers: sharedInfrastructureComponents,
    exports: sharedInfrastructureComponents,
})
export class SharedInfrastructureModule { }
