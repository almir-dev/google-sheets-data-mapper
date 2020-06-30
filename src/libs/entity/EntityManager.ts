class EntityManagerImpl {
  entityMap: { [key: string]: any } = {};

  register<T>(entityName: string, entity: T) {
    this.entityMap[entityName] = entity;
    console.log("registering entity", this.entityMap);
  }
}

export const EntityManager = new EntityManagerImpl();
