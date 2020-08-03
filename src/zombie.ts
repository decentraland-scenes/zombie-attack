export class Zombie extends Entity {
  constructor(model: GLTFShape, transform: Transform) {
    super()
    engine.addEntity(this)
    this.addComponent(model)
    this.addComponent(transform)

    this.addComponent(new Animator())
    this.getComponent(Animator).addClip(new AnimationState("Walking", { looping: true }))
    this.getComponent(Animator).addClip(new AnimationState("Attacking", { looping: true }))
    this.getComponent(Animator).getClip("Walking").play()
  }

  // Play attacking animation
  attack() {
    this.stopAnimations()
    this.getComponent(Animator).getClip("Attacking").play()
  }

  // Play walking animation
  walk() {
    this.stopAnimations()
    this.getComponent(Animator).getClip("Walking").play()
  }

  // Bug workaround: otherwise the next animation clip won't play
  stopAnimations() {
    this.getComponent(Animator).getClip("Walking").stop()
    this.getComponent(Animator).getClip("Attacking").stop()
  }
}


