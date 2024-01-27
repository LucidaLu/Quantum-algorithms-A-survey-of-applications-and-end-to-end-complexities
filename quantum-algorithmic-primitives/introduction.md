# Quantum algorithmic primitives

To deliver an advantage over classical approaches, end-to-end quantum solutions must exploit known quantum phenomena capable of providing a quantum speedup. The disparate collection of known [quantum applications](../areas-of-application/introduction.md#areas-of-application) is built from a common group of *quantum algorithmic primitives*, which are the source of quantum advantage. Algorithmic primitives are typically not suited for directly solving an end-to-end problem, due to their reliance on unspecified oracles or because their input and/or output does not exactly match that of the end-to-end problem (e.g., some primitives output a quantum state rather than classical data, and thus they have no direct classical analogue). Nevertheless, it can be very fruitful to think of algorithms as compositions of different algorithmic primitives, both for higher-level intuitive overview and for independently studying and optimizing the primitives themselves.


This part surveys a variety of quantum algorithmic primitives. For each, we sketch the basic idea of what they do and how they work, as well as discussing example use cases and important caveats. We generally assume that these primitives will need to be implemented in [fault-tolerant](../fault-tolerant-quantum-computation/introduction.md#fault-tolerant-quantum-computation) fashion when they are used within an end-to-end solution for a given [application](../areas-of-application/introduction.md#areas-of-application), but we comment on NISQ implementations in passing.





