import { Zombie } from './zombie'

// Base
const base = new Entity()
base.addComponent(new GLTFShape('models/baseLight.glb'))
base.addComponent(
  new Transform({
    scale: new Vector3(2, 1, 2)
  })
)
engine.addEntity(base)

// Zombie
const zombie = new Zombie(
  new GLTFShape('models/zombie.glb'),
  new Transform({
    position: new Vector3(16, 0.933, 16)
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
    const lookAtTarget = new Vector3(
      player.position.x,
      transform.position.y,
      player.position.z
    )
    const direction = lookAtTarget.subtract(transform.position)
    transform.rotation = Quaternion.Slerp(
      transform.rotation,
      Quaternion.LookRotation(direction),
      dt * ROT_SPEED
    )

    // Continue to move towards the player until it is within 2m away
    const distance = Vector3.DistanceSquared(
      transform.position,
      player.position
    ) // Check distance squared as it's more optimized
    if (distance >= 4) {
      // Note: Distance is squared so a value of 4 is when the zombie is standing 2m away
      zombie.walk()
      const forwardVector = Vector3.Forward().rotate(transform.rotation)
      const increment = forwardVector.scale(dt * MOVE_SPEED)
      transform.translate(increment)
    } else {
      zombie.attack()
    }
  }
}

engine.addSystem(new ZombieAttack())
