class EntityManagerImpl {
  entityMap: { [key: string]: any } = {};

  register<T>(entityName: string, entity: any) {
    this.entityMap[entityName] = entity;
  }
}

export const EntityManager = new EntityManagerImpl();
