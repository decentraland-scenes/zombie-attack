import { Zombie } from "./zombie"

// Base
const base = new Entity()
base.addComponent(new GLTFShape("models/baseLight.glb"))
base.addComponent(
  new Transform({
    scale: new Vector3(2, 1, 2),
  })
)
engine.addEntity(base)

// Zombie
const zombie = new Zombie(
  new GLTFShape("models/zombie.glb"),
  new Transform({
    position: new Vector3(16, 0.933, 16),
  })
)

// Configuration
const MOVE_SPEED = 1
const ROT_SPEED = 1

// Intermediate variables
const player = Camera.instance
const transform = zombie.getComponent(Transform)

class ZombieAttack implements ISystem {
  update(dt: number) {
    // Rotate to face the player
    let lookAtTarget = new Vector3(player.position.x, transform.position.y, player.position.z)
    let direction = lookAtTarget.subtract(transform.position)
    transform.rotation = Quaternion.Slerp(transform.rotation, Quaternion.LookRotation(direction), dt * ROT_SPEED)

    // Continue to move towards the player until it is within 2m away
    let distance = Vector3.Distance(transform.position, player.position) // Check distance between zombie and player

    if (distance >= 2) {
      zombie.walk()
      let forwardVector = Vector3.Forward().rotate(transform.rotation)
      let increment = forwardVector.scale(dt * MOVE_SPEED)
      transform.translate(increment)
    } else {
      zombie.attack()
    }
  }
}

engine.addSystem(new ZombieAttack())