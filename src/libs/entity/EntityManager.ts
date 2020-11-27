class EntityManagerImpl {
  entityMap: { [key: string]: any } = {};

  register<T>(entityName: string, entity: any) {
    this.entityMap[entityName] = entity;
    console.log("registering entity", this.entityMap);
  }
}

export const EntityManager = new EntityManagerImpl();
